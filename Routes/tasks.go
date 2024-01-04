package routes

import (
	controller "TaskManage/Controller"

	"github.com/gin-gonic/gin"
)

func Init() {
	Tasks := gin.Default()
	Tasks.Group("/tasks")
	Tasks.GET("/", controller.GetTasks)
	Tasks.POST("/", controller.CreateTask)
	Tasks.PUT("/:id", controller.UpdateTask)
	Tasks.DELETE("/:id", controller.DeleteTask)
	Tasks.GET("/:id", controller.GetTaskById)

	Tasks.Run(":8080")
}
