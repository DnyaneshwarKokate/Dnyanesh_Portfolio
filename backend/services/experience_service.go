package services

import (
	"portfolio-backend/dtos"
	"portfolio-backend/models"
	"portfolio-backend/repositories"
)

type ExperienceService interface {
	GetAllExperiences() ([]models.Experience, error)
	CreateExperience(dto dtos.CreateExperienceDTO) (*models.Experience, error)
	UpdateExperience(id uint, dto dtos.CreateExperienceDTO) (*models.Experience, error)
	DeleteExperience(id uint) error
}

type experienceService struct {
	repo repositories.ExperienceRepository
}

func NewExperienceService(repo repositories.ExperienceRepository) ExperienceService {
	return &experienceService{repo: repo}
}

func (s *experienceService) GetAllExperiences() ([]models.Experience, error) {
	return s.repo.FindAll()
}

func (s *experienceService) CreateExperience(dto dtos.CreateExperienceDTO) (*models.Experience, error) {
	exp := &models.Experience{
		Title:       dto.Title,
		Company:     dto.Company,
		Location:    dto.Location,
		Period:      dto.Period,
		Description: dto.Description,
		IsIntern:    dto.IsIntern,
		Order:       dto.Order,
	}

	err := s.repo.Create(exp)
	if err != nil {
		return nil, err
	}
	return exp, nil
}

func (s *experienceService) UpdateExperience(id uint, dto dtos.CreateExperienceDTO) (*models.Experience, error) {
	exp, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	exp.Title = dto.Title
	exp.Company = dto.Company
	exp.Location = dto.Location
	exp.Period = dto.Period
	exp.Description = dto.Description
	exp.IsIntern = dto.IsIntern
	exp.Order = dto.Order

	err = s.repo.Update(exp)
	if err != nil {
		return nil, err
	}
	return exp, nil
}

func (s *experienceService) DeleteExperience(id uint) error {
	return s.repo.Delete(id)
}
