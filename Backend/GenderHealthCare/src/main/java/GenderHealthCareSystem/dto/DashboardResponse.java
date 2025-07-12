package GenderHealthCareSystem.dto;

import lombok.Data;

import java.util.List;
@Data
public class DashboardResponse {

    private Overview overview;
    private Revenue revenue;
    private Appointments appointments;
    private Distribution distribution;
    private Totals totals;
    private List<Detail> details;

    @Data
    public static class Overview {
        private List<String> dates;
        private List<Integer> consultingAppointments;
        private List<Integer> testingAppointments;
        private List<Long> revenue;
    }

    @Data
    public static class Revenue {
        private List<String> dates;
        private List<Long> consulting;
        private List<Long> testing;
        private List<Long> total;
    }

    @Data
    public static class Appointments {
        private List<String> dates;
        private List<Integer> consulting;
        private List<Integer> testing;
        private List<Integer> total;
    }

    @Data
    public static class Distribution {
        private Integer consulting;
        private Integer testing;
    }

    @Data
    public static class Totals {
        private Integer totalAppointments;
        private Integer totalConsultingAppointments;
        private Integer totalTestingAppointments;
        private Long totalConsultingRevenue;
        private Long totalTestingRevenue;
        private Long totalRevenue;
    }

    @Data
    public static class Detail {
        private String date;
        private Integer consultingAppointments;
        private Integer testingAppointments;
        private Long consultingRevenue;
        private Long testingRevenue;
        private Long totalRevenue;
    }
}
