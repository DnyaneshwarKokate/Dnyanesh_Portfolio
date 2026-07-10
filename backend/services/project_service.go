package services

import (
	"portfolio-backend/dtos"
	"portfolio-backend/models"
	"portfolio-backend/repositories"
)

type ProjectService interface {
	GetAllProjects() ([]models.Project, error)
	CreateProject(dto dtos.CreateProjectDTO) (*models.Project, error)
	UpdateProject(id uint, dto dtos.CreateProjectDTO) (*models.Project, error)
	DeleteProject(id uint) error
}

type projectService struct {
	repo repositories.ProjectRepository
}

func NewProjectService(repo repositories.ProjectRepository) ProjectService {
	return &projectService{repo: repo}
}

func (s *projectService) GetAllProjects() ([]models.Project, error) {
	return s.repo.FindAll()
}

func (s *projectService) CreateProject(dto dtos.CreateProjectDTO) (*models.Project, error) {
	proj := &models.Project{
		Title:           dto.Title,
		Description:     dto.Description,
		LongDescription: dto.LongDescription,
		Technologies:    dto.Technologies,
		Category:        dto.Category,
		GithubURL:       dto.GithubURL,
		LiveURL:         dto.LiveURL,
	}

	err := s.repo.Create(proj)
	if err != nil {
		return nil, err
	}
	return proj, nil
}

func (s *projectService) UpdateProject(id uint, dto dtos.CreateProjectDTO) (*models.Project, error) {
	proj, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	proj.Title = dto.Title
	proj.Description = dto.Description
	proj.LongDescription = dto.LongDescription
	proj.Technologies = dto.Technologies
	proj.Category = dto.Category
	proj.GithubURL = dto.GithubURL
	proj.LiveURL = dto.LiveURL

	err = s.repo.Update(proj)
	if err != nil {
		return nil, err
	}
	return proj, nil
}

func (s *projectService) DeleteProject(id uint) error {
	return s.repo.Delete(id)
}
