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

type SkillController struct {
	skillService services.SkillService
}

func NewSkillController(skillService services.SkillService) *SkillController {
	return &SkillController{skillService: skillService}
}

func (c *SkillController) GetSkills(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("GetSkills Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	resp, err := c.skillService.GetAllSkills()
	if err != nil {
		logrus.Errorf("GetSkills Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Skills retrieved successfully.", resp)
}

func (c *SkillController) CreateSkill(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("CreateSkill Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	var req dtos.CreateSkillDTO
	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		utils.BadRequestResponse(ctx, constant.ErrorConstants.InvalidRequestPayload)
		return
	}

	if validation := utils.ValidateRequest(ctx, req); validation != nil {
		utils.ValidationResponse(ctx, validation.(string))
		return
	}

	resp, err := c.skillService.CreateSkill(req)
	if err != nil {
		logrus.Errorf("CreateSkill Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Skill created successfully.", resp)
}

func (c *SkillController) UpdateSkill(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("UpdateSkill Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	idStr := ctx.Param("id")
	idVal, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.BadRequestResponse(ctx, "Invalid skill ID format")
		return
	}

	var req dtos.CreateSkillDTO
	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		utils.BadRequestResponse(ctx, constant.ErrorConstants.InvalidRequestPayload)
		return
	}

	if validation := utils.ValidateRequest(ctx, req); validation != nil {
		utils.ValidationResponse(ctx, validation.(string))
		return
	}

	resp, err := c.skillService.UpdateSkill(uint(idVal), req)
	if err != nil {
		logrus.Errorf("UpdateSkill Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Skill updated successfully.", resp)
}

func (c *SkillController) DeleteSkill(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("DeleteSkill Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	idStr := ctx.Param("id")
	idVal, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.BadRequestResponse(ctx, "Invalid skill ID format")
		return
	}

	err = c.skillService.DeleteSkill(uint(idVal))
	if err != nil {
		logrus.Errorf("DeleteSkill Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Skill deleted successfully.", nil)
}
