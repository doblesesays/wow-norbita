import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryName'
})
export class CategoryNamePipe implements PipeTransform {

  transform(category: String): any {
    if (category === 'dishwashers') {
      return 'Dishwashers'
    } else {
      return 'Small Appliances'
    }
  }

}
