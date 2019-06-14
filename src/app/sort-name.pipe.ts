import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortName'
})
export class SortNamePipe implements PipeTransform {

  transform(sort: String): any {
    if (sort === 'price') {
      return 'Price'
    } else {
      return 'Title'
    }
  }

}
