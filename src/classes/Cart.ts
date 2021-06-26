import CartInterface from "../interfaces/CartInterface";
import { createImageFromLines } from '../utils/SpritesheetUtils';

class Cart {
  data: CartInterface;
  constructor(data: CartInterface){
    this.data = data;
  }

  generateSpriteSheet(){
    const image = createImageFromLines(this.data.spritesheet);
    image.write('./output/spritesheet/spritesheet.png');
  }

}

export default Cart;