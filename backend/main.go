package main

import (
	"log"
	"portfolio-backend/config"
	"portfolio-backend/controllers"
	"portfolio-backend/middleware"
	"portfolio-backend/repositories"
	"portfolio-backend/services"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize Logger
	config.InitLogger()

	// Initialize database and seed records
	config.InitDB()

	// Initialize Gin router
	r := gin.Default()

	// Configure CORS middleware to connect securely with Next.js frontend
	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Dependency Injection (Repositories)
	projectRepo := repositories.NewProjectRepository(config.DB)
	skillRepo := repositories.NewSkillRepository(config.DB)
	experienceRepo := repositories.NewExperienceRepository(config.DB)
	messageRepo := repositories.NewMessageRepository(config.DB)
	userRepo := repositories.NewUserRepository(config.DB)

	// Dependency Injection (Services)
	authServ := services.NewAuthService(userRepo)
	projectServ := services.NewProjectService(projectRepo)
	skillServ := services.NewSkillService(skillRepo)
	experienceServ := services.NewExperienceService(experienceRepo)
	messageServ := services.NewMessageService(messageRepo)

	// Dependency Injection (Controllers)
	authCtrl := controllers.NewAuthController(authServ)
	projectCtrl := controllers.NewProjectController(projectServ)
	skillCtrl := controllers.NewSkillController(skillServ)
	experienceCtrl := controllers.NewExperienceController(experienceServ)
	messageCtrl := controllers.NewMessageController(messageServ)

	// Setup API routes
	api := r.Group("/api")
	{
		// Public routes
		api.GET("/projects", projectCtrl.GetProjects)
		api.GET("/skills", skillCtrl.GetSkills)
		api.GET("/experience", experienceCtrl.GetExperience)
		api.POST("/contact", messageCtrl.SubmitContact)
		api.POST("/auth/login", authCtrl.Login)

		// Protected dashboard routes
		dashboard := api.Group("/dashboard")
		dashboard.Use(middleware.AuthMiddleware())
		{
			dashboard.POST("/projects", projectCtrl.CreateProject)
			dashboard.PUT("/projects/:id", projectCtrl.UpdateProject)
			dashboard.DELETE("/projects/:id", projectCtrl.DeleteProject)
			dashboard.POST("/skills", skillCtrl.CreateSkill)
			dashboard.PUT("/skills/:id", skillCtrl.UpdateSkill)
			dashboard.DELETE("/skills/:id", skillCtrl.DeleteSkill)
			dashboard.POST("/experience", experienceCtrl.CreateExperience)
			dashboard.PUT("/experience/:id", experienceCtrl.UpdateExperience)
			dashboard.DELETE("/experience/:id", experienceCtrl.DeleteExperience)
			dashboard.GET("/messages", messageCtrl.GetMessages)
			dashboard.DELETE("/messages/:id", messageCtrl.DeleteMessage)
		}
	}

	// Start server on port 8081
	log.Println("Starting Go backend server on port 8081...")
	if err := r.Run(":8081"); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
