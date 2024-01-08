package routes

import (
	controller "TaskManage/Controller"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/markbates/pkger"
)

func Init() *gin.Engine {
	router := gin.Default()

	// Enable CORS with default configuration
	router.Use(cors.Default())

	// Define API routes
	api := router.Group("/tasks")
	{
		api.GET("/get", controller.GetTasks)
		api.POST("/create", controller.CreateTask)
		api.PUT("/:id", controller.UpdateTask)
		api.DELETE("/:id", controller.DeleteTask)
		api.GET("/:id", controller.GetTaskById)
	}

	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("Frontend/index.html"))))

	// Run the server
	router.Run(":8080")

	return router
}
