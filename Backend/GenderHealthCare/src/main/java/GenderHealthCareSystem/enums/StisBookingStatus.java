package GenderHealthCareSystem.enums;

public enum StisBookingStatus {
    PENDING,
    CONFIRMED,
    COMPLETED,
    CANCELLED,
    NO_SHOW, //Người đặt không đến đúng giờ, không thông báo, và bỏ lỡ lịch khám
    DENIED,//Người đặt không đủ điều kiện để đặt lịch khám
    DELETED //Người đặt đã xóa lịch khám, không cần đến nữa
}
