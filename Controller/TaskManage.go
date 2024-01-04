package controller

import (
	models "TaskManage/Models"
	"context"
	"log"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	taskCollection *mongo.Collection
)

func Init() {
	log.Println("Controller is Started")
	log.Println("Initializing the Database")

	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err.Error())
		return
	}

	log.Print("Pinging the Database")
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	//Init the Database Table
	taskCollection = client.Database("ManageTasks").Collection("Tasks")

}

func GetTasks(ctx *gin.Context) {
	log.Println("Request for Get Tasks Arrived")
	var response []models.Tasks

	cur, err := taskCollection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err.Error())
		ctx.JSON(200, gin.H{"message": "Error in Fetching the Tasks"})
	}

	defer cur.Close(ctx)

	for cur.Next(ctx) {
		var task models.Tasks
		err := cur.Decode(&task)
		if err != nil {
			log.Fatal(err.Error())
			ctx.JSON(200, gin.H{"message": "Error in Fetching the Tasks"})
		}
		response = append(response, task)
	}

	//Return the Response
	ctx.JSON(200, struct {
		Message string         `json:"message"`
		Data    []models.Tasks `json:"data"`
	}{
		Message: "Success",
		Data:    response,
	})
	return
}

func CreateTask(ctx *gin.Context) {
	log.Println("Request for Create Task Arrived")
	var task models.Tasks

	if err := ctx.BindJSON(&task); err != nil {
		log.Fatal(err.Error())
		ctx.JSON(400, gin.H{"message": "Error in Parsing Request Body"})
		return
	}

	_, err := taskCollection.InsertOne(ctx, task)
	if err != nil {
		log.Fatal(err.Error())
		ctx.JSON(500, gin.H{"message": "Error in Creating Task"})
		return
	}

	ctx.JSON(200, gin.H{"message": "Task Created Successfully", "data": task})
	return
}

func UpdateTask(ctx *gin.Context) {
	log.Println("Request for Update Task Arrived")
	taskID := ctx.Param("id")

	var updatedTask models.Tasks
	if err := ctx.BindJSON(&updatedTask); err != nil {
		log.Fatal(err.Error())
		ctx.JSON(400, gin.H{"message": "Error in Parsing Request Body"})
		return
	}

	filter := bson.M{"_id": taskID}
	update := bson.M{"$set": updatedTask}

	result, err := taskCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Fatal(err.Error())
		ctx.JSON(500, gin.H{"message": "Error in Updating Task"})
		return
	}

	if result.ModifiedCount == 0 {
		ctx.JSON(404, gin.H{"message": "Task not found"})
		return
	}

	ctx.JSON(200, gin.H{"message": "Task Updated Successfully"})
	return
}

func DeleteTask(ctx *gin.Context) {
	log.Println("Request for Delete Task Arrived")
	taskID := ctx.Param("id")

	filter := bson.M{"_id": taskID}
	result, err := taskCollection.DeleteOne(ctx, filter)
	if err != nil {
		log.Fatal(err.Error())
		ctx.JSON(500, gin.H{"message": "Error in Deleting Task"})
		return
	}

	if result.DeletedCount == 0 {
		ctx.JSON(404, gin.H{"message": "Task not found"})
		return
	}

	ctx.JSON(200, gin.H{"message": "Task Deleted Successfully"})
	return
}

func GetTaskById(ctx *gin.Context) {
	log.Println("Request for Get Task by ID Arrived")
	taskID := ctx.Param("id")

	var task models.Tasks
	filter := bson.M{"_id": taskID}

	err := taskCollection.FindOne(ctx, filter).Decode(&task)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			ctx.JSON(404, gin.H{"message": "Task not found"})
			return
		}
		log.Fatal(err.Error())
		ctx.JSON(500, gin.H{"message": "Error in Fetching Task"})
		return
	}

	ctx.JSON(200, gin.H{"message": "Success", "data": task})
	return
}
