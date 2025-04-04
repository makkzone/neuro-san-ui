from framework.artifacts.notebook_requirements_persistor import NotebookRequirementsPersistor

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Generate and write a requirements file.")
    parser.add_argument("--build_version", help="Version of code used to generate requirements file")
    parser.add_argument("--artifacts_dir", help="Path where the generated file should be written")

    args = parser.parse_args()

    persistor = NotebookRequirementsPersistor(args.build_version, None, None, args.artifacts_dir)
    persistor.persist(None)
