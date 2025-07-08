package GenderHealthCareSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingStatisticsResponse {
    private Long totalRatings;
    private Double averageRating;
    private Map<Integer, Long> ratingCounts;

    public RatingStatisticsResponse(Long totalRatings, Double averageRating) {
        this.totalRatings = totalRatings;
        this.averageRating = averageRating;
    }
}
