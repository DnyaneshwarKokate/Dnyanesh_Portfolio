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

type ExperienceController struct {
	experienceService services.ExperienceService
}

func NewExperienceController(experienceService services.ExperienceService) *ExperienceController {
	return &ExperienceController{experienceService: experienceService}
}

func (c *ExperienceController) GetExperience(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("GetExperience Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	resp, err := c.experienceService.GetAllExperiences()
	if err != nil {
		logrus.Errorf("GetExperience Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Experience timeline retrieved successfully.", resp)
}

func (c *ExperienceController) CreateExperience(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("CreateExperience Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	var req dtos.CreateExperienceDTO
	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		utils.BadRequestResponse(ctx, constant.ErrorConstants.InvalidRequestPayload)
		return
	}

	if validation := utils.ValidateRequest(ctx, req); validation != nil {
		utils.ValidationResponse(ctx, validation.(string))
		return
	}

	resp, err := c.experienceService.CreateExperience(req)
	if err != nil {
		logrus.Errorf("CreateExperience Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Experience created successfully.", resp)
}

func (c *ExperienceController) UpdateExperience(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("UpdateExperience Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	idStr := ctx.Param("id")
	idVal, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.BadRequestResponse(ctx, "Invalid experience ID format")
		return
	}

	var req dtos.CreateExperienceDTO
	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		utils.BadRequestResponse(ctx, constant.ErrorConstants.InvalidRequestPayload)
		return
	}

	if validation := utils.ValidateRequest(ctx, req); validation != nil {
		utils.ValidationResponse(ctx, validation.(string))
		return
	}

	resp, err := c.experienceService.UpdateExperience(uint(idVal), req)
	if err != nil {
		logrus.Errorf("UpdateExperience Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Experience updated successfully.", resp)
}

func (c *ExperienceController) DeleteExperience(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("DeleteExperience Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	idStr := ctx.Param("id")
	idVal, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.BadRequestResponse(ctx, "Invalid experience ID format")
		return
	}

	err = c.experienceService.DeleteExperience(uint(idVal))
	if err != nil {
		logrus.Errorf("DeleteExperience Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Experience deleted successfully.", nil)
}
