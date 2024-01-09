package main

import (
	controller "TaskManage/Controller"
	routes "TaskManage/Routes"
	"fmt"
)

func main() {

	fmt.Println("Server is Starting on Port 8080")
	//Init the Database
	controller.Init()

	//Init the Router
	routes.Init()
}
