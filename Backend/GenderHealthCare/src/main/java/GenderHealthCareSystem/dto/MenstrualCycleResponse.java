        package GenderHealthCareSystem.dto;

        import lombok.AllArgsConstructor;
        import lombok.Data;
        import lombok.NoArgsConstructor;

        import java.time.LocalDate;
        import java.time.LocalDateTime;

        @Data
        @AllArgsConstructor
        @NoArgsConstructor
        public class MenstrualCycleResponse {
            private Integer cycleId;
            private Integer customerId;    // chỉ giữ ID, không trả toàn bộ object customer
            private LocalDate startDate;
            private LocalDate endDate;
            private Integer cycleLength;
            private String note;
            private LocalDateTime createdAt;
        }
