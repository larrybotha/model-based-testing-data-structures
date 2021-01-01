import { TestPlan, TestPath } from "@xstate/test/es/types";

const testAllPlans = (
  testPlans: TestPlan<any, any>[],
  cb: (testPath: TestPath<any>) => void | Promise<void>
) => {
  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        it(path.description, async () => {
          await cb(path);
        });
      });
    });
  });
};

export { testAllPlans };
