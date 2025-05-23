package main

import (
	"github.com/d-rov/digital-dopamine/api/database"
	"github.com/d-rov/digital-dopamine/api/routes"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()
	database.InitDB()
	routes.RegisterRoutes(e)
	e.Logger.Fatal(e.Start(":3000"))
}
