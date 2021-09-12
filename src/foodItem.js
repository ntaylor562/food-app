export default class FoodItem {
    constructor(name, expirationDate, quantity = 1) {
        this.itemName = name;
        this.expirationDate = expirationDate;
        this.quantity = quantity;
    }
}