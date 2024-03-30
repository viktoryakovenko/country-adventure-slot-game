# Layout

### Layout

Layout system provided ability to configure positions of view elements on the stage;

#### To create: 
```typescript
const layoutManager = new LayoutManager(() => {
    window.dispatchEvent(new Event("resize"));
});
```
Layout manager works by plugin, plugins will do the main job.
Layout manager calculate positions, plugins applying elements positions to the elements.
So, for work in the pixi you need to add pixi plugin: 
```typescript
layoutManager.addPlugin(new PixiLayoutPlugin(this.app.stage));
```
#### To add layout: 
```typescript
this.layoutManager.addLayout({
    width: 100,
    height: 100,
    name: 'MainElement',
    top: 100,
    left: 100,
});
```
#### Each Layouts should have a name:

To recognize elements on the stage, layout manage should know element name
Name should be unique, otherwise it will work only with first element with a target name

