# neuro-ui Deployment Process

This directory contains a number of Codefresh pipeline YAMLs and shell scripts that together form the basis of our 
CI/CD deployment of the neuro-ui application.
This README will describe the processes and pipelines that orchestrate this work.

## Allow Codefresh to Access Kuberenetes Cluster(s) ##
In order to for CF to access the clusters, the connection must be setup using the CF ui.
https://codefresh.io/docs/docs/integrations/kubernetes/#connect-a-kubernetes-cluster

## Automatic Deployment to dev Environment at Merge to Main
When a PR for the neuro-ui repo is approved via the Github UI, a user can then choose to Merge that new code into the 
main branch. When the merge to main occurs, the pipeline `deploy-trigger.yml` is triggered, the defining yaml being 
named the same as the pipeline.

This pipeline is simply an orchestration step which provides the desired version and the appropriate namespace for 
two other pipelines. The pipeline supports two different use cases as implied by the name. 
In the case of `set_version_main_merge` the version/tag is the short version of the git sha of the latest commit in 
main, while the namespace is `dev`.

The `build` pipeline is triggered with the provided git SHA. This pipeline builds the neuro-ui image. 
The pipeline pushes the newly built image to the appropriate registry in our ECR on AWS. 

Once the image is built, the `deploy` pipeline is triggered, with the version and namespace passed in as variables.
This pipeline runs a script `deploy_to_cluster.py` which runs the appropriate `kubectl` commands to update the pod 
versions in the kubernetes `deployments`. Note that in order for this to work, Codefresh needs to have some access 
to the cluster. This is configured via the Codefresh UI. See documentation from Codefresh to accomplish this,
specifically https://codefresh.io/docs/docs/integrations/kubernetes/#connect-a-kubernetes-cluster

## Automatic Deployment to staging Environment at Github Release
When we gather a number of new fixes or features in the neuro-ui main branch, we as a team decide to make a release 
to get these features tested on our staging environment, and eventually onto the production environment. 
To accomplish this task, we use the same three pipelines mentioned above `deploy-trigger` , `build`, and `deploy`. 
We use the Github Release mechanism which is accessed via the Github UI as a manual step. 
The operator will supply a new SemVer tag during this process, and accept the auto-generated release notes. 
Once the release is created, the aforementioned pipelines are triggered, but this time using the `staging` namespace 
and the newly created SemVer tag as the version. The entire process takes approximately 15-20 minutes. 
Upon completion, the new release is ready for testing on the staging environment. 

## Manual Deployment to production Environment
Since all the images for a given version were built in the previous Staging build step, we only need to run the 
`deploy` pipeline. To do so, the operator navigates to the Codefresh pipeline and sets two pipeline variables 
`NAMESPACE` and `neuro-ui_VERSION`. For production, the namespace is currently `leaf-neuro-ui` while the version will 
be the exact version string just tested on staging.

There is one additional manual step to perform before deploying to production. Our system depends on a SQS queue 
to send training jobs to our worker cluster. If a job is running during deployment, that run will be lost/orphaned, 
so we aim to avoid this situation. To do that, we simply check the SQS queue and ensure nothing is in the queue, 
or wait if there is something in the queue. To check the queue, access the AWS console, SQS Queues and look in 
`us-west-2` and `us-east-2` for the `sqs_studioml_gorunner_cpu_production_0` queue. 
This check could easily be automated with the AWS cli, but that has not been done yet.

## Manual Deployment of Arbitrary Version to Arbitrary Environment
If needed, the `deploy-trigger` and `deploy` pipelines can be run manually with the user providing the version 
(git SHA) and desired namespace. This is done rarely but on occasion there may be a new feature that is difficult 
for a developer to test without a full cluster deploy, so we can switch the dev namespace to some arbitrary git SHA 
for testing.

## Hot Fix Deployment
The process outlined above pushes/releases only the `main` branch into our environment(s). 
In the event of a needed hot fix after a release and after `main` has already progressed with new features that are 
  untested or otherwise not ready for prime time, we use a Hot Fix process.
1. The developer creating the fix will pull the latest released tag and branch off that.
2. They will create the fix and PR the changes.
3. Upon review, the PR is merged into the hot-fix branch. Note, it is smoother if the developer does _not_ tag the 
  branch. That will be done in the next step.
4. Using the Github UI, a new release is created. 
  - Choose a tag: create a new tag and use the appropriate SemVer value
  - Target: the hot-fix branch
5. The automatic deployment to staging is triggered only for the `main` branch, so the operator will need to manually 
  run the `deploy-trigger` using the correct new version.
6. After the images are built, the operator needs to run the `deploy` pipeline with the correct version and namespace.
7. Once the staging release passes testing, the operator releases to production in the same way as outlined above.
