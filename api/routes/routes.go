package routes

import (
	"log"

	"github.com/d-rov/digital-dopamine/api/handlers"

	"github.com/labstack/echo/v4"
)

func RegisterRoutes(e *echo.Echo) {
	e.POST("/log", handlers.LogSite)
	e.POST("/classify", handlers.ClassifySite)
	// /summary?period=[day|week|month]
	e.GET("/summary", handlers.DataSummary)
	// /category?site=url
	e.GET("/category", handlers.SiteCategory)
	e.GET("/categories", handlers.SiteCategories)

	log.Println("routes registered...")
}
