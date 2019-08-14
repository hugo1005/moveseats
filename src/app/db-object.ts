import { BehaviorSubject } from 'rxjs';

export class DbObject<T> extends BehaviorSubject<any> {
  private dbPath: string[];
  private dbService: any;
  
  constructor(state, path, userService) {
    super(state);

    this.dbPath = path;
    this.dbService = userService;

    //Listen for socket loaded

    if(state['socketLoading']) {
      
      this.dbService.ListenForSocketLoaded().subscribe((loaded) => {
        if(loaded) {
          
          let newValue = this.NewValue;
          this.QuietUpdate(newValue);
        
        } 
      });

    }

    // console.log("Setup dbObject for path: " + path);
  }

  QuietUpdate(val) {
    //console.log("Quiet updating path: " + JSON.stringify(this.dbPath));
    this.next(val);
  }

  Update(val) {
    //console.log("Updating value : " + JSON.stringify(val));

    this.next(val);
    this.dbService.SocketUpdate(val, this.dbPath);
  }

  Push(val) {
    
    let newValue = this.NewValue;

    try {
      newValue.push(val);
      this.Update(newValue);
    } catch (e) {
      
      throw newValue.err || 'cannot push to non-array type';
    }
  }

  Replace(locator, newElem) {
    let newValue = this.NewValue;

    try {
      let index = newValue.findIndex((elem) => elem[locator.key] === locator.value);

      if(index > -1) {
        newValue[index] = newElem;
        this.Update(newValue);
      }
    } catch (e) { 
      throw newValue.err || 'cannot push to non-array type';
    }
  }

  IncrementStat() {
    let newValue = this.NewValue;

    this.Update(newValue + 1);
  }

  Remove(locator) {
    let newValue = this.NewValue;
  
    
    try {
      let index = newValue.findIndex((elem) => elem[locator.key] === locator.value);

      if(index > -1) {
        newValue.splice(index, 1);
        
        this.Update(newValue);
      }
    } catch (e) { 
      throw e || 'cannot push to non-array type';
    }
  }
  
  Add(path: string, defaultValue?: any) {
    let newValue = this.NewValue;

    console.log("Accessing path " + this.dbPath.join('/')); 

    console.log("Accessing path val: " + JSON.stringify(newValue)); 

    newValue[path] = defaultValue || {};

    console.log("Adding path " + path + " to val: " + JSON.stringify(newValue)); 

    this.Update(newValue);
  }

  private get NewValue(): any {
    return this.dbService.dbValueFromRoute(this.dbPath.slice());
  } 
}