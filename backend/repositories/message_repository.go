package repositories

import (
	"portfolio-backend/models"
	"gorm.io/gorm"
)

type MessageRepository interface {
	FindAll() ([]models.Message, error)
	Create(message *models.Message) error
	Delete(id uint) error
}

type messageRepository struct {
	db *gorm.DB
}

func NewMessageRepository(db *gorm.DB) MessageRepository {
	return &messageRepository{db: db}
}

func (r *messageRepository) FindAll() ([]models.Message, error) {
	var messages []models.Message
	err := r.db.Order("created_at DESC").Find(&messages).Error
	return messages, err
}

func (r *messageRepository) Create(message *models.Message) error {
	return r.db.Create(message).Error
}

func (r *messageRepository) Delete(id uint) error {
	return r.db.Delete(&models.Message{}, id).Error
}
