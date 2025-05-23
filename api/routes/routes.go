package routes

import (
	"github.com/d-rov/digital-dopamine/api/handlers"

	"github.com/labstack/echo/v4"
)

func RegisterRoutes(e *echo.Echo) {
	e.POST("/log", handlers.LogSite)
}
