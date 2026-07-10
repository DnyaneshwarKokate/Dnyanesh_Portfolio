package repositories

import (
	"portfolio-backend/models"
	"gorm.io/gorm"
)

type ExperienceRepository interface {
	FindAll() ([]models.Experience, error)
	FindByID(id uint) (*models.Experience, error)
	Create(experience *models.Experience) error
	Update(experience *models.Experience) error
	Delete(id uint) error
}

type experienceRepository struct {
	db *gorm.DB
}

func NewExperienceRepository(db *gorm.DB) ExperienceRepository {
	return &experienceRepository{db: db}
}

func (r *experienceRepository) FindAll() ([]models.Experience, error) {
	var experiences []models.Experience
	err := r.db.Order("`order` ASC").Find(&experiences).Error
	return experiences, err
}

func (r *experienceRepository) FindByID(id uint) (*models.Experience, error) {
	var experience models.Experience
	err := r.db.First(&experience, id).Error
	if err != nil {
		return nil, err
	}
	return &experience, nil
}

func (r *experienceRepository) Create(experience *models.Experience) error {
	return r.db.Create(experience).Error
}

func (r *experienceRepository) Update(experience *models.Experience) error {
	return r.db.Save(experience).Error
}

func (r *experienceRepository) Delete(id uint) error {
	return r.db.Delete(&models.Experience{}, id).Error
}
