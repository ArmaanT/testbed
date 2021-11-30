import dedent from 'ts-dedent';
import { Construct } from "constructs";
import { App, CheckoutJob, Stack, Workflow } from "cdkactions";

export class MyStack extends Stack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const workflow = new Workflow(this, 'workflow', {
      name: 'Test',
      on: {
        push: {
          branches: ['**'],
          tags: ['[0-9]+.[0-9]+.[0-9]+'],
        },
        pullRequest: {}
      }
    })
    new CheckoutJob(workflow, 'job', {
      runsOn: 'ubuntu-latest',
      if: "startsWith(github.ref, 'refs/tags')",
      steps: [
        {
          name: 'Job',
          run: dedent`echo \$GITHUB_REF
          GIT_TAG=\${GITHUB_REF/refs\\/tags\\//}
          echo $GIT_TAG
          `
        }
      ]
    })

  }
}

const app = new App();
new MyStack(app, 'cdk');
app.synth();
