package routes

import (
	controller "TaskManage/Controller"
	"net/http"
	"os"

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

	// Serve frontend files
	router.LoadHTMLGlob("Frontend/*.html")
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	router.Static("/static", "Frontend/static")
	// Run the server

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	router.Run(":" + port)

	return router
}
