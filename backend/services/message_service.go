package services

import (
	"time"
	"portfolio-backend/dtos"
	"portfolio-backend/models"
	"portfolio-backend/repositories"
)

type MessageService interface {
	GetAllMessages() ([]models.Message, error)
	SubmitMessage(dto dtos.CreateMessageDTO) (*models.Message, error)
	DeleteMessage(id uint) error
}

type messageService struct {
	repo repositories.MessageRepository
}

func NewMessageService(repo repositories.MessageRepository) MessageService {
	return &messageService{repo: repo}
}

func (s *messageService) GetAllMessages() ([]models.Message, error) {
	return s.repo.FindAll()
}

func (s *messageService) SubmitMessage(dto dtos.CreateMessageDTO) (*models.Message, error) {
	msg := &models.Message{
		Name:      dto.Name,
		Email:     dto.Email,
		Subject:   dto.Subject,
		Content:   dto.Content,
		CreatedAt: time.Now(),
	}

	err := s.repo.Create(msg)
	if err != nil {
		return nil, err
	}
	return msg, nil
}

func (s *messageService) DeleteMessage(id uint) error {
	return s.repo.Delete(id)
}
