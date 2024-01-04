package main

import (
	controller "TaskManage/Controller"
	routes "TaskManage/Routes"
	"fmt"
)

func main() {

	fmt.Println("Server is Starting")
	//Init the Database
	controller.Init()

	//Init the Router
	routes.Init()
	return
}
