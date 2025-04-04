# Unileaf Deployment Process

This build_script directory contains a number of codefresh pipeline yamls and shell scripts that together form the basis of our CI/CD deployment of the unileaf application.
This readme will describe the processes and pipelines that orchestate this work.

## Allow Codefresh to Access Kuberenetes Cluster(s) ##
In order to for CF to access the clusters, the connection must be setup using the CF ui.
https://codefresh.io/docs/docs/integrations/kubernetes/#connect-a-kubernetes-cluster

## Automatic Deployment to dev Environment at Merge to Main
When a PR for the unileaf repo is approved via the Github UI, a user can then choose to Merge that new code into the main branch. When the merge to main occurs, the pipeline
***build-deploy-main-merge-or-release*** is triggered, the defining yaml being named the same as the pipeline name.

This pipeline is simply an orchestration step which provides the desired version and the appropriate namespace for two other pipelines. The pipeline supports two different use cases as implied by the name. In the case of main-merge, the version/tag is the short version of the git sha of the latest commit in main, while the namespace is `dev`.

The ***build-all-images*** pipeline is triggered with the provided git sha. This pipeline builds all of the containers required for a unileaf deployment. Note that for the ui-node, each environment requires a seperate container because the ui requires a gateway specification, which can only be provided at docker build time. Thus this pipeline builds 3 containers for the ui-node, one for each environment, even though not all environments are necessarily needed. The pipeline pushes the new images to the appropriate registy in our ECR on AWS. 

Once all the images are built, the ***deploy*** pipeline is triggered, with the version and namespace passed in as variables to the pipeline. This pipeline runs a script `deploy-to-kubernetes.sh` which runs the appropriate `kubectl` commands to update the pod versions in the kubernetes `deployments`. Note that in order for this to work, Codefresh needs to have some access to the cluster. This is configured via the Codefresh UI. There is ample documentation from Codefresh to accomplish this. Perhaps the most salient link is this: https://codefresh.io/docs/docs/integrations/kubernetes/#connect-a-kubernetes-cluster

## Automatic Deployment to staging Environment at Github Release
When we gather a number of new fixes or features in the unileaf main branch, we as a team decide to make a release to get these features tested on our staging environment, and eventually onto the production environment. To accomplish this task, we use the same three pipelines mentioned above ***build-deploy-main-merge-or-release*** , ***build-all-images*** ,***deploy***. We use the Github Release mechanism which is accessed via the Github UI as a manual step. The user will supply a new sem-ver tag during this process, and accept the auto-generated release notes. Once the Release is created, the aforementioned pipelines are triggered, but this time using the `staging` namespace and the newly created sem-ver tag as the version. The entire process takes approximately 15-20 minutes. Upon completion, the new Release is ready for testing on the staging environment. At this time, the cadence of new releases is approximately once per week.

## Manual Deployment to production Environment
Once testing of a new release is complete and QA has given the green light, the Release is pushed to production. Generally we will discuss exact timing of the Release to avoid pushing around important demos. Since all the images for a given version were built in the previous staging build step, we only need to run the ***deploy*** pipeline. To do so, the operator navigates to the Codefresh pipeline and sets two pipeline variables `NAMESPACE` and `UNILEAF_VERSION`. For production, the namespace is currently `leaf-unileaf` while the version will be the exact version string just tested on staging.

There is one additional manual step to perform before deploying to production. Our system depends on a sqs queue to send jobs (experiments) to our worker cluster. If a job is running during deployment, that run will be lost/orphaned, so we aim to avoid this situation. To do that, we simply check the sqs queue and ensure nothing is in the queue, or wait if there is something in the queue. To check the queue, access the AWS console, SQS Queues and look in us-west-2 and us-east-2 for the `sqs_studioml_gorunner_cpu_production_0` queue. This check could easily be automated with the AWS cli, but that has not been done yet.

## Manual Deployment of Arbitrary Version to Arbitrary Environment
If needed, the ***build-all-images*** and ***deploy*** pipelines can be run manually with the user providing the version (git sha) and desired namespace. This is rarely used but on occassion there may be a new feature that is difficult for a developer to test without a full cluster deploy, so we can switch the dev namespace to some arbitrary git sha for testing.

## Hot Fix Deployment
The process outlined above pushes/releases only the `main` branch into our environment(s). In the event of a needed hot fix after a release and after `main` has already progressed with new features that are untested or otherwise not ready for prime time, we use a Hot Fix process.
1. The developer creating the fix will pull the latest released tag and branch off that.
2. They will create the fix and PR the changes.
3. Upon review, the PR is merged into the hot-fix branch. Note, it is smoother if the developer does _not_ tag the branch. That will be done in the next step.
4. Using the Github UI, a new Release is created. 
- Choose a tag: create a new tag and use the appropriate sem-ver value
- Target: the hot-fix branch
5. The automatic deployment to staging is triggered only for the `main` branch, so the operator will need to manually run the ***build-all-images*** using the correct new version.
6. After the images are built, the operator needs to run the ***deploy*** pipeline with the correct version and namespace.
7. Once the staging release passes testing, the operator releases to production in the same way as outlined above.
