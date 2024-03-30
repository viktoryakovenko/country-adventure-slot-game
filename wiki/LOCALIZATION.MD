# Localization

### First where they could be usable is a controls:
#### in controls, it would be needed to add:

```typescript
import MainControl from "./MainControl";

class Control extends MainControl{
    @inject(Localization)
    private readonly localization!: Localization;
    
    doSomething(){
        this.text = this.localization.text('text_id')
    }
}
```

#### you can find example of translation in: 
this [folder](./../resources/assets/configs/localization)

### TBD
