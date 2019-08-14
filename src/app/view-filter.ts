import { BehaviorSubject } from 'rxjs';

export class ViewFilter extends BehaviorSubject<any[]> {
  state = [];
  name: string = "filter";

  constructor(initialState: any[], filterName: string) {
    super(initialState);
    
    this.state = initialState;
    this.name = filterName;
  }

  Update(newState) {
    this.state = newState;
    this.next(newState);

    console.log("Filter changed!: " + JSON.stringify(newState));
  }

  UpdateProp(key, value) {
    let index = this.state.findIndex((val)=>{
      return val['key']===key;
    });
    
    let newFilter: any[] = this.state.slice();

    if(value !== "") {
      index > -1?
      newFilter[index]={'key':key, 'value':value}:
      newFilter.push({'key':key, 'value':value});

      
    } else {
       index > -1? newFilter = newFilter.splice(index,1): ()=>{};
    }

    this.Update(newFilter);

    // console.log("1 Setting filter: " + JSON.stringify(newFilter) + " for :" + this.name);
  }

  // Some helpful global filtering methods

  static FindProp(key: string, filter: any[]): any {
    return filter.find((prop) => prop.key === key);
  }

  static ApplyFilter(single, filter: any[]): boolean {
    let excpts: number = 0;
    
    if(filter.length > 0) {
      let matches: Array<number>= filter.map((f) => {
          if(single[f.key]) {
            return single[f.key] === f.value? 0: 1;
          } else {
            return 0;
          }  
      });
      excpts = matches.reduce((acc,val)=>{return acc+val;})
    }

    return excpts === 0;
  }

  static Filter(arr: any[], filter: any[]): any[] {
    // console.log("Filtering stream: " + JSON.stringify(arr) + " by : " + JSON.stringify(filter));
    return arr.filter((single) => this.ApplyFilter(single, filter));
  }

}