package services

import (
	"portfolio-backend/dtos"
	"portfolio-backend/models"
	"portfolio-backend/repositories"
)

type SkillService interface {
	GetAllSkills() ([]models.Skill, error)
	CreateSkill(dto dtos.CreateSkillDTO) (*models.Skill, error)
	UpdateSkill(id uint, dto dtos.CreateSkillDTO) (*models.Skill, error)
	DeleteSkill(id uint) error
}

type skillService struct {
	repo repositories.SkillRepository
}

func NewSkillService(repo repositories.SkillRepository) SkillService {
	return &skillService{repo: repo}
}

func (s *skillService) GetAllSkills() ([]models.Skill, error) {
	return s.repo.FindAll()
}

func (s *skillService) CreateSkill(dto dtos.CreateSkillDTO) (*models.Skill, error) {
	skill := &models.Skill{
		Name:     dto.Name,
		Category: dto.Category,
		Level:    dto.Level,
	}

	err := s.repo.Create(skill)
	if err != nil {
		return nil, err
	}
	return skill, nil
}

func (s *skillService) UpdateSkill(id uint, dto dtos.CreateSkillDTO) (*models.Skill, error) {
	skill, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	skill.Name = dto.Name
	skill.Category = dto.Category
	skill.Level = dto.Level

	err = s.repo.Update(skill)
	if err != nil {
		return nil, err
	}
	return skill, nil
}

func (s *skillService) DeleteSkill(id uint) error {
	return s.repo.Delete(id)
}
