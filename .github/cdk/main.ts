// import dedent from 'ts-dedent';
import { Construct } from "constructs";
import { App, CheckoutJob, Stack, Workflow } from "cdkactions";

export class MyStack extends Stack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const workflow = new Workflow(this, 'workflow', {
      name: 'Test',
      on: {
        push: {
          branches: ['master']
        },
        pullRequest: {}
      }
    })
    new CheckoutJob(workflow, 'job', {
      runsOn: 'ubuntu-latest',
      steps: [
        {
          name: 'Job',
          run: 'echo "Hello!"'
        }
      ]
    })

  }
}

const app = new App();
new MyStack(app, 'cdk');
app.synth();
