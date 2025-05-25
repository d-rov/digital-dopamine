package routes

import (
	"github.com/d-rov/digital-dopamine/api/handlers"

	"github.com/labstack/echo/v4"
)

func RegisterRoutes(e *echo.Echo) {
	e.POST("/log", handlers.LogSite)
	// e.POST /classify
	// e.GET /summary (?period=day|week|month) query params
	// e.GET /categories
}
