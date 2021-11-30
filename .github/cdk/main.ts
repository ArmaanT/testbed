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
      container: {
        image: `python:3.8`,
      },
      steps: [
        {
          name: 'Job',
          shell: "bash",
          run: dedent`GIT_TAG=\${GITHUB_REF/refs\\/tags\\//}
          LIBRARY_VERSION="0.0.16"
          if [[ "$GIT_TAG" != "$LIBRARY_VERSION" ]]; then echo "Tag does not match poetry version"; exit 1; fi`,
        }
      ]
    })

  }
}

const app = new App();
new MyStack(app, 'cdk');
app.synth();
