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

type MessageController struct {
	messageService services.MessageService
}

func NewMessageController(messageService services.MessageService) *MessageController {
	return &MessageController{messageService: messageService}
}

func (c *MessageController) GetMessages(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("GetMessages Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	resp, err := c.messageService.GetAllMessages()
	if err != nil {
		logrus.Errorf("GetMessages Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Contact messages retrieved successfully.", resp)
}

func (c *MessageController) SubmitContact(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("SubmitContact Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	var req dtos.CreateMessageDTO
	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		utils.BadRequestResponse(ctx, constant.ErrorConstants.InvalidRequestPayload)
		return
	}

	if validation := utils.ValidateRequest(ctx, req); validation != nil {
		utils.ValidationResponse(ctx, validation.(string))
		return
	}

	resp, err := c.messageService.SubmitMessage(req)
	if err != nil {
		logrus.Errorf("SubmitContact Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Contact message submitted successfully.", resp)
}

func (c *MessageController) DeleteMessage(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			logrus.Errorf("DeleteMessage Panic : %v", r)
			utils.InternalServerErrorResponse(ctx, fmt.Errorf("internal server error"))
		}
	}()

	idStr := ctx.Param("id")
	idVal, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.BadRequestResponse(ctx, "Invalid message ID format")
		return
	}

	err = c.messageService.DeleteMessage(uint(idVal))
	if err != nil {
		logrus.Errorf("DeleteMessage Service Error : %v", err)
		utils.InternalServerErrorWithMessage(ctx, err.Error())
		return
	}

	utils.SuccessResponse(ctx, "Contact message deleted successfully.", nil)
}
