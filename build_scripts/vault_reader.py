from enum import Enum

import sys
import os
import argparse
import hvac


class Errors(Enum):
    """
    Class describing errors that can happen
    """
    NO_ERROR = 0
    VAULT_LOGIN_FAILED = 1
    INVALID_NAMESPACE = 2
    SECRET_KEYS_NOT_FOUND = 3


class VaultReader:
    """
    A class to encapsulate the logic of gathering key value pairs from a Vault
    server, and printing the output such that the output of this utility can
    be read by a shell so the env vars persist outside the process that runs this.
    """

    def __init__(self, namespace, vault_url: str = None, github_token: str = None):
        """
        Constructor

        :param namespace: Required string. Should be one of dev, staging or prod.
        :param vault_url: Optional string pointing to vault server. If not supplied,
                        the value comes from the LEAF_TEAM_VAULT_ADDR env var.
        :param github_token: Optional string for signing into vault server. If not supplied,
                        the value comes from the VAULT_GITHUB_AUTH_TOKEN env var.
        """

        self.namespace = namespace
        self.vault_url = vault_url
        self.github_token = github_token

        if self.vault_url is None:
            # Precedence order: VAULT_ADDR, VAULT, then LEAF_TEAM_VAULT_ADDR
            self.vault_url = os.environ.get("VAULT_ADDR",
                                            os.environ.get("VAULT",
                                                           os.environ.get("LEAF_TEAM_VAULT_ADDR")))
        if self.github_token is None:
            # Precedence order: VAULT_LOGIN, VAULT_GITHUB_AUTH_TOKEN
            self.github_token = os.environ.get("VAULT_LOGIN",
                                               os.environ.get("VAULT_GITHUB_AUTH_TOKEN"))

        self.namespace_to_cluster = {
            "dev": "unileaf-dev-stage",
            "staging": "unileaf-dev-stage",
            "prod": "neuroai"
        }

        self.vault_keys_list = [
            ("clusters/{cluster}/{namespace}/s3CredsLeafBuildDAI", [
                ["AWS_SECRET_ACCESS_KEY", "AWS_SECRET_ACCESS_KEY"],
                ["AWS_ACCESS_KEY_ID", "AWS_ACCESS_KEY_ID"]
            ]),
            ("clusters/{cluster}/{namespace}/db-creds", [
                ["DB_USERNAME", "username"],
                ["DB_PASSWORD", "password"],
                ["DB_HOST", "host"],
                ["DB_PORT", "port"],
                ["DB_NAME", "dbname"]
            ])
        ]

    def vault_login(self) -> hvac.Client:
        """
        Manage the login to a vault server
        :return: An hvac.Client that is connected to the vault_url
                 or None if connecting there failed.
        """
        client = hvac.Client(url=self.vault_url)
        try:
            client.auth.github.login(token=self.github_token)
            return client
        except hvac.exceptions.InvalidRequest as e:
            print(f"Failed to log in: {e}", file=sys.stderr)
            return None

    def get_cluster_name(self, namespace: str) -> str:
        """
        :param namespace: A deployment namespace (dev, staging, prod)
        :return: The cluster which houses that namespace.
        """
        return self.namespace_to_cluster.get(namespace, "")

    def read_vault_secrets(self, client: hvac.Client) -> Errors:
        """
        Read the desired key value pairs from Vault and set
        the necessary environment variables with the values.

        :param client: The Vault Client with access to the secrets.
        :return: An integer enum describing the error that happend during execution,
                 If no errors, this value is NO_ERROR.
        """
        error = Errors.NO_ERROR

        if not client:
            print("Vault login failed.", file=sys.stderr)
            return Errors.VAULT_LOGIN_FAILED

        cluster = self.get_cluster_name(self.namespace)
        if not cluster:
            print(f"Invalid namespace: '{self.namespace}'", file=sys.stderr)
            return Errors.INVALID_NAMESPACE

        found_all_keys = True
        for vault_path_template, keys in self.vault_keys_list:
            vault_path = vault_path_template.format(cluster=cluster, namespace=self.namespace)
            secret = client.secrets.kv.v2.read_secret_version(path=vault_path, raise_on_deleted_version=False)
            data = secret.get("data", {}).get("data", {}) if secret else {}
            for env_var, key in keys:
                value = data.get(key)
                if value is not None:
                    # This ends up showing up in security scans as an issue about
                    # "Clear-text logging of sensitive information",
                    # yet this is exactly what this script is intended for functionally
                    # and it is only build infrastructure - not shipped to any client.
                    print(f"export {env_var}=\"{value}\"")
                else:
                    print(f"Key '{key}' not found in path '{vault_path}'", file=sys.stderr)
                    found_all_keys = False

        if not found_all_keys:
            error = Errors.SECRET_KEYS_NOT_FOUND

        return error


def main():
    """
    Take in a vault url, a github token and a namespace.
    From that info, get the necessary credentials to run a db migration
    and set those values as enviroment variables.
    """
    parser = argparse.ArgumentParser(
                description="Read secrets from Vault and output as exported variables so a shell can read")
    parser.add_argument("namespace", type=str, choices=["dev", "staging", "prod"],
                        help="Namespace")
    parser.add_argument("--vault_url", dest="vault_url", type=str, default=None, required=False,
                        help="Vault URL")
    parser.add_argument("--github_token", dest="github_token", type=str, default=None, required=False,
                        help="GitHub token for authentication")
    args = parser.parse_args()

    vault_reader = VaultReader(args.namespace, args.vault_url, args.github_token)
    client = vault_reader.vault_login()
    error = vault_reader.read_vault_secrets(client)
    if error != Errors.NO_ERROR:
        sys.exit(error.value)


if __name__ == "__main__":
    main()
