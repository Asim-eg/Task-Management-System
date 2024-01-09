package main

import (
	controller "TaskManage/Controller"
	routes "TaskManage/Routes"
	"context"
	"fmt"
)

func main() {

	fmt.Println("Server is Starting on Port 8080")
	//Init the Database
	controller.Init()

	//Init the Router
	routes.Init()

	defer func() {
		if err := controller.Client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()
}
