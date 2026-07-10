package controllers

import (
	"encoding/json"
	"fmt"
	"strconv"
	"portfolio-backend/constant"
	"portfolio-backend/dtos"
	"portfolio-backend/services"
	"portfolio-backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type ProjectController struct {
	projectService services.ProjectService
}

func NewProjectController(projectService services.ProjectService) *ProjectController {
	return &ProjectController{projectService: projectService}
}

func (c *ProjectController) GetProjects(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("GetProjects Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	resp, err := c.projectService.GetAllProjects()
	if err != nil {
		logrus.Errorf("GetProjects Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Projects retrieved successfully.", resp)
}

func (c *ProjectController) CreateProject(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("CreateProject Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	var req dtos.CreateProjectDTO
	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		utils.BadRequestResponse(ctx, constant.ErrorConstants.InvalidRequestPayload)
		return
	}

	if validation := utils.ValidateRequest(ctx, req); validation != nil {
		utils.ValidationResponse(ctx, validation.(string))
		return
	}

	resp, err := c.projectService.CreateProject(req)
	if err != nil {
		logrus.Errorf("CreateProject Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Project created successfully.", resp)
}

func (c *ProjectController) UpdateProject(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("UpdateProject Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	idStr := ctx.Param("id")
	idVal, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.BadRequestResponse(ctx, "Invalid project ID format")
		return
	}

	var req dtos.CreateProjectDTO
	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		utils.BadRequestResponse(ctx, constant.ErrorConstants.InvalidRequestPayload)
		return
	}

	if validation := utils.ValidateRequest(ctx, req); validation != nil {
		utils.ValidationResponse(ctx, validation.(string))
		return
	}

	resp, err := c.projectService.UpdateProject(uint(idVal), req)
	if err != nil {
		logrus.Errorf("UpdateProject Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Project updated successfully.", resp)
}

func (c *ProjectController) DeleteProject(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("DeleteProject Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	idStr := ctx.Param("id")
	idVal, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.BadRequestResponse(ctx, "Invalid project ID format")
		return
	}

	err = c.projectService.DeleteProject(uint(idVal))
	if err != nil {
		logrus.Errorf("DeleteProject Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Project deleted successfully.", nil)
}
