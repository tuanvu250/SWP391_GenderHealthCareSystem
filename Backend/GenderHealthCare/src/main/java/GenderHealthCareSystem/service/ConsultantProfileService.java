package GenderHealthCareSystem.service;

import GenderHealthCareSystem.model.ConsultantProfile;
import GenderHealthCareSystem.model.ProfileDetail;
import GenderHealthCareSystem.model.Users;
import GenderHealthCareSystem.dto.ConsultantProfileRequest;
import GenderHealthCareSystem.dto.ProfileDetailRequest;
import GenderHealthCareSystem.dto.ConsultantProfileResponse;
import GenderHealthCareSystem.repository.ConsultantProfileRepository;
import GenderHealthCareSystem.repository.ProfileDetailRepository;
import GenderHealthCareSystem.repository.UsersRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConsultantProfileService {

    private final ConsultantProfileRepository profileRepo;
    private final UsersRepository usersRepo;
    private final ProfileDetailRepository detailRepo;

    @Transactional
    public String create(Integer consultantId, ConsultantProfileRequest req) {
        Users user = usersRepo.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"CONSULTANT".equalsIgnoreCase(user.getRole().getRoleName())) {
            throw new RuntimeException("Only CONSULTANT can create profile.");
        }

        ConsultantProfile profile = ConsultantProfile.builder()
                .consultant(user)
                .jobTitle(req.getJobTitle())
                .introduction(req.getIntroduction())
                .specialization(req.getSpecialization())
                .languages(req.getLanguages())
                .experienceYears(req.getExperienceYears())
                .hourlyRate(req.getHourlyRate())
                .location(req.getLocation())
                .isAvailable(req.getIsAvailable())
                .rating(0.0)
                .reviewCount(0)
                .build();

        List<ProfileDetail> details = req.getDetails().stream()
                .map(d -> ProfileDetail.builder()
                        .profile(profile)
                        .detailType(d.getDetailType())
                        .title(d.getTitle())
                        .organization(d.getOrganization())
                        .fromDate(d.getFromDate())
                        .toDate(d.getToDate())
                        .description(d.getDescription())
                        .issuedDate(d.getIssuedDate())
                        .build())
                .toList();

        profile.setDetails(details);
        profileRepo.save(profile);
        return "Profile created successfully";
    }

    @Transactional
    public String update(Integer consultantId, ConsultantProfileRequest req) {
        ConsultantProfile profile = profileRepo.findByConsultantUserId(consultantId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setJobTitle(req.getJobTitle());
        profile.setIntroduction(req.getIntroduction());
        profile.setSpecialization(req.getSpecialization());
        profile.setLanguages(req.getLanguages());
        profile.setExperienceYears(req.getExperienceYears());
        profile.setHourlyRate(req.getHourlyRate());
        profile.setLocation(req.getLocation());
        profile.setIsAvailable(req.getIsAvailable());

        profile.getDetails().clear();
        List<ProfileDetail> newDetails = req.getDetails().stream()
                .map(d -> ProfileDetail.builder()
                        .profile(profile)
                        .detailType(d.getDetailType())
                        .title(d.getTitle())
                        .organization(d.getOrganization())
                        .fromDate(d.getFromDate())
                        .toDate(d.getToDate())
                        .description(d.getDescription())
                        .issuedDate(d.getIssuedDate())
                        .build())
                .toList();

        profile.getDetails().addAll(newDetails);
        profileRepo.save(profile);
        return "Profile updated successfully";
    }

    public ConsultantProfileRequest get(Integer consultantId) {
        Users user = usersRepo.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ConsultantProfile profile = profileRepo.findByConsultantUserId(consultantId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        ConsultantProfileRequest response = new ConsultantProfileRequest();
        response.setJobTitle(profile.getJobTitle());
        response.setIntroduction(profile.getIntroduction());
        response.setSpecialization(profile.getSpecialization());
        response.setLanguages(profile.getLanguages());
        response.setExperienceYears(profile.getExperienceYears());
        response.setHourlyRate(profile.getHourlyRate());
        response.setLocation(profile.getLocation());
        response.setIsAvailable(profile.getIsAvailable());
        response.setDetails(profile.getDetails().stream().map(detail -> {
            ProfileDetailRequest detailRequest = new ProfileDetailRequest();
            detailRequest.setDetailType(detail.getDetailType());
            detailRequest.setTitle(detail.getTitle());
            detailRequest.setOrganization(detail.getOrganization());
            detailRequest.setFromDate(detail.getFromDate());
            detailRequest.setToDate(detail.getToDate());
            detailRequest.setDescription(detail.getDescription());
            detailRequest.setIssuedDate(detail.getIssuedDate());
            return detailRequest;
        }).toList());

        response.setFullName(user.getFullName()); // Add fullName from Users

        return response;
    }

    public void delete(Integer consultantId) {
        ConsultantProfile profile = profileRepo.findByConsultantUserId(consultantId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profileRepo.delete(profile);
    }

    public List<ConsultantProfileResponse> getAllConsultants() {
        List<ConsultantProfile> profiles = profileRepo.findAll();
        return profiles.stream().map(profile -> {
            ConsultantProfileResponse response = new ConsultantProfileResponse();
            response.setJobTitle(profile.getJobTitle());
            response.setIntroduction(profile.getIntroduction());
            response.setSpecialization(profile.getSpecialization());
            response.setLanguages(profile.getLanguages());
            response.setExperienceYears(profile.getExperienceYears());
            response.setHourlyRate(profile.getHourlyRate());
            response.setLocation(profile.getLocation());
            response.setIsAvailable(profile.getIsAvailable());
            response.setDetails(profile.getDetails().stream().map(detail -> {
                ProfileDetailRequest detailRequest = new ProfileDetailRequest();
                detailRequest.setDetailType(detail.getDetailType());
                detailRequest.setTitle(detail.getTitle());
                detailRequest.setOrganization(detail.getOrganization());
                detailRequest.setFromDate(detail.getFromDate());
                detailRequest.setToDate(detail.getToDate());
                detailRequest.setDescription(detail.getDescription());
                detailRequest.setIssuedDate(detail.getIssuedDate());
                return detailRequest;
            }).toList());

            response.setFullName(profile.getConsultant().getFullName()); // Add fullName from Users

            return response;
        }).toList();
    }

    @Transactional
    public String updateEmploymentStatus(Integer consultantId, Boolean employmentStatus) {
        ConsultantProfile profile = profileRepo.findByConsultantUserId(consultantId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setEmploymentStatus(employmentStatus);
        profileRepo.save(profile);
        return "Employment status updated successfully";
    }

    @Transactional
    public String updateHourlyRate(Integer consultantId, Double hourlyRate) {
        ConsultantProfile profile = profileRepo.findByConsultantUserId(consultantId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setHourlyRate(hourlyRate);
        profileRepo.save(profile);
        return "Hourly rate updated successfully";
    }
}
