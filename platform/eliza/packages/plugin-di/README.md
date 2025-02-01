# @elizaos/plugin-di - Dependency Injection Plugin for Eliza

This plugin provides a dependency injection system for Eliza plugins.

## What is Dependency Injection?

Dependency Injection is a design pattern that allows you to inject dependencies into a class or function. This pattern is useful for decoupling components and making your code more modular and testable.

## Examples of How to build a Plugin using Dependency Injection

Check the [example](./src/_examples/) folder for a simple example of how to create a plugin using Dependency Injection.

## Decorators for Dependency Injection

This plugin provides a set of decorators that you can use to inject dependencies into your classes or functions.

### From inversify

We use the [inversify](https://inversify.io/) library to provide the dependency injection system.
The following decorators are provided by the [inversify](https://inversify.io/) library.

#### `@injectable`

> Category: Class Decorator

This decorator marks a class as injectable. This means that you can inject this class into other classes using the `@inject` decorator.

```typescript
import { injectable } from "inversify";

@injectable()
class SampleClass {
}
```

Remember to register the class with the container before injecting it into other classes.

```typescript
import { globalContainer } from "@elizaos/plugin-di";

// Register the class with the container as a singleton, this means that the class will be instantiated only once.
globalContainer.bind(SingletonClass).toSelf().inSingletonScope();
// Register the class with the container as a request context, this means that the class will be instantiated for each request(in this case means each Character).
globalContainer.bind(CharactorContextClass).toSelf().inRequestScope();
```

#### `@inject`

> Category: Parameter Decorator

This decorator marks a parameter as an injection target. This means that the parameter will be injected with the appropriate dependency when the class is instantiated.

```typescript
import { injectable, inject } from "inversify";

@injectable()
class SampleClass {
  constructor(
    // Inject the SampleDependency as a public property of the class.
    @inject("SampleDependency") public sampleDependency: SampleDependency
  ) {}
}
```

### From di plugin

DI plugin provides abstract classes that you can extend to create Injectable actions or evaluators.
And that provides the following decorators to improve the readability of the code.

#### `@property`

> Category: Property Decorator

This decorator is used to define a property in an action content class  which will be used to generate the action content object Schema and content description template for LLM object generation.

```typescript
import { z } from 'zod';
import { property } from "@elizaos/plugin-di";

class SampleActionContent {
  @property({
    description: "Sample property description",
    schema: z.string(),
  })
  sampleProperty: string;
}
```

## Abstract Classes for Injaectable Actions and Evaluators

This plugin provides abstract classes that you can extend to create Injectable actions or evaluators.

### `BaseInjectableAction`

This abstract class simplify the creation of injectable actions.
You don't need to think about the template for content generation, it will be generated automatically based on the properties of the content Class.
What you need to implement is the `execute` method.

```typescript
import { injectable } from "inversify";
import { BaseInjectableAction } from "@elizaos/plugin-di";

class SampleActionContent {
    @property({
        description: "Sample property description",
        schema: z.string(),
    })
    property1: string;
}

@injectable()
class SampleAction extends BaseInjectableAction<SampleActionContent> {
    constructor() {
        super({
            /** general action constent options */
            contentClass: SampleActionContent,
        });
    }

    /**
     * It will be called by `handler` function when the action is triggered.
     */
    async execute(
        content: SampleActionContent | null,
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        callback?: HandlerCallback
    ): Promise<void> {
        // Your action logic here
    }
}
```

### `BaseInjectableEvaluator`

This abstract class simplify the creation of injectable evaluators.

Please refer to the [sampleEvaluator](./src/_examples/sampleEvaluator.ts) for an example of how to create an evaluator.
