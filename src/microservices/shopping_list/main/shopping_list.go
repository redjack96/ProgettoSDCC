package main

import (
	"fmt"

	props "shopping_list.microservice/main/util"
)

type ShoppingList struct {
	name     string
	products []Product
}

// In go non ci sono le enum:
type ProductType int64

const (
	Meat ProductType = iota // con la parola chiave iota si definiscono i tipi dell'enum
	Fish
	Fruit
	Vegetable
	Drink
	Other
)

type Product struct {
	id          int64 // e' un intero a cui ho cambiato il nome i64. Rappresenta l'id di un prodotto. Due prodotti con lo stesso nome possono avere id differenti.
	name        string
	prodType    ProductType // r# serve per fare escape della parola chiave type. Cosi' si puo accedere a ProductInfo.type
	expire_date string      // Todo: usare una data
	expired     bool
}

// func (p Product) ToString() string {
//     return fmt.Sprintf("Product(%d, %s, %d, %s, %s)\n", p.id, p.name, p.prodType, p.expire_date, p.expire_date)
// }

// func (s ShoppingList) ToString() string{
//     return fmt.Sprintf("ShoppingList: %s\n%v", s.name, s.products) // %v stampa la struct senza i nomi. %+v stampa anche i nomi
// }

func main() {

	prod := Product{
		id:          1,
		name:        "Prosciutto",
		prodType:    Meat,
		expire_date: "2022/12/31",
		expired:     false,
	}

	product_list := make([]Product, 10)

	product_list[0] = prod

	shoppingList := ShoppingList{
		name:     "lista1",
		products: product_list,
	}

	fmt.Printf("This is a shopping list.\n%+v\n", shoppingList)
	val, _ := props.GetProperties()
	fmt.Printf("Properties %+v\n", val)
}
