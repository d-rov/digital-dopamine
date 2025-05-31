package main

import (
	"fmt"
	"log"
	"os"

	"github.com/d-rov/digital-dopamine/api/database"
	"github.com/d-rov/digital-dopamine/api/routes"

	"github.com/labstack/echo/v4"
)

func main() {
	logFile, err := os.OpenFile("log.txt", os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		log.Fatalf("Failed to open log file: %v", err)
	}
	defer logFile.Close()

	log.SetOutput(logFile)
	log.Println("main.go: log start")

	e := echo.New()

	database.InitDB()
	routes.RegisterRoutes(e)

	e.Logger.Fatal(e.Start(":3000"))

	fmt.Println("Listening on port 3000")
}
