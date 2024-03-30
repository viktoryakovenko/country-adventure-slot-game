# Injections

### Dependency Manager

This is a primitive way of how to manage dependencies: 
Initially dependency manager is a singleton, and available everywhere.

To use to, need to register the instance that you want to use.
```typescript
dependencyManager.register(Instance, new Instance());
```
To get instance you need to get it:
```typescript
dependencyManager.resolve(Instance);
```

### Annotations

For use annotations, instance should be created by: 
```typescript
Composer
Disposer
```
It also can work if instance have init method.

You can use annotation to get this instance in your instance:
```typescript
export default class MainScene extends Scene {
    @inject(LayoutManager)
    private readonly layoutManager!: LayoutManager;
    
    //...
}
```
You can use annotations to resolve and register instance if it still not registered:
```typescript
export default class MainScene extends Scene {
    @inject(MotionLayerControl, () => {
        const motionLayerControl = new MotionLayerControl();
        motionLayerControl.addExtension(new OnResizeExtension());
        return motionLayerControl;
    })
    private readonly motionLayer!: MotionLayerControl;
    
    //...
}
```
