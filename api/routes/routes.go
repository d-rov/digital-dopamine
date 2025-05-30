package routes

import (
	"log"

	"github.com/d-rov/digital-dopamine/api/handlers"

	"github.com/labstack/echo/v4"
)

func RegisterRoutes(e *echo.Echo) {
	e.POST("/log", handlers.LogSite)
	// e.POST /classify
	// /summary?period=[day|week|month]
	e.GET("/summary", handlers.DataSummary)
	// e.GET /categories

	log.Println("routes registered...") // TESTING
}
