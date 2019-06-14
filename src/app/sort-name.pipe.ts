import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortName'
})
export class SortNamePipe implements PipeTransform {

  transform(sort: String): any {
    if (sort === 'price_asc') {
      return 'Price Asc'
    } else if (sort === 'price_desc')  {
      return 'Price Desc'
    }else{
      return 'Name'
    }
  }

}
