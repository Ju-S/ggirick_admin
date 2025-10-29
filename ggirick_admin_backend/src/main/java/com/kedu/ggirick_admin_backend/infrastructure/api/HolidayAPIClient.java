package com.kedu.ggirick_admin_backend.infrastructure.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class HolidayAPIClient {

    private static final String SERVICE_KEY = "발급받은_API_KEY"; // TODO: application.yml 로 이동

    public List<Map<String, Object>> fetchHolidays(int year) {
        try {
            String url = String.format(
                    "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo"
                            + "?solYear=%d&numOfRows=100&ServiceKey=%s&_type=json",
                    year, SERVICE_KEY
            );

            Map<String, Object> response = WebClient.create()
                    .get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) return List.of();

            Map<String, Object> body = (Map<String, Object>) ((Map<String, Object>) response.get("response")).get("body");
            Map<String, Object> items = (Map<String, Object>) body.get("items");

            if (items == null || items.get("item") == null)
                return List.of();

            Object item = items.get("item");
            if (item instanceof List) {
                return (List<Map<String, Object>>) item;
            } else {
                return List.of((Map<String, Object>) item);
            }

        } catch (Exception e) {
            log.error("❌ 공휴일 API 호출 실패: {}", e.getMessage());
            return List.of();
        }
    }
}
