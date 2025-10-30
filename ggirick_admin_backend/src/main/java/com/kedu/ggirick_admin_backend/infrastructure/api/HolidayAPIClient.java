package com.kedu.ggirick_admin_backend.infrastructure.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component // 스프링 컴포넌트 스캔 대상 (빈으로 등록)
@Slf4j     // 로그 사용을 위한 롬복 어노테이션
public class HolidayAPIClient {

    @Value("${holiday.api.key}")  // application.properties → .env 순서로 주입
    private String dataApiKey;

    // 간단한 외부 API 호출용 동기 HTTP 클라이언트 (Spring Web 기본 제공)
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 지정한 연도(year)의 공휴일 목록을 공공데이터포털 API로부터 조회한다.
     * @param year 조회 연도 (예: 2025)
     * @return 공휴일 item 맵들의 리스트 (없으면 빈 리스트)
     */
    @SuppressWarnings("unchecked") // Map 캐스팅 시 컴파일 경고 억제
    public List<Map<String, Object>> fetchHolidays(int year) {
        try {
            // 1. 호출 URL 구성 (query string에 연도와 서비스키 삽입)
            String url = String.format(
                    "https://apis.data.go.kr/B090041/SpcdeInfoService/getRestDeInfo" +
                            "?solYear=%d&numOfRows=100&ServiceKey=%s&_type=json",
                    year, dataApiKey
            );

            // 2. GET 요청 전송 후 JSON을 Map 형태로 수신 (실패 시 예외 발생)
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            // 3. 널 응답 방어 로직: 문제 시 빈 리스트 반환
            if (response == null) {
                log.warn("공휴일 API 응답이 null 입니다. year={}", year);
                return List.of();
            }

            // 4. 응답 구조(response → body → items → item) 접근
            //    공공데이터포털 표준 구조를 따른다.
            Map<String, Object> responseObj = (Map<String, Object>) response.get("response");
            if (responseObj == null) {
                log.warn("응답 내 'response' 노드 없음. raw={}", response);
                return List.of();
            }

            Map<String, Object> body = (Map<String, Object>) responseObj.get("body");
            if (body == null) {
                log.warn("응답 내 'body' 노드 없음. response={}", responseObj);
                return List.of();
            }

            Map<String, Object> items = (Map<String, Object>) body.get("items");
            if (items == null) {
                // 공휴일이 전혀 없을 때 items 자체가 없기도 함
                log.info("해당 연도 공휴일 없음 또는 items 누락. year={}", year);
                return List.of();
            }

            // 5. item은 단일 객체이거나(List가 아닌) 배열(List)로 내려올 수 있어 형태 분기
            Object item = items.get("item");
            if (item == null) {
                // 정말로 데이터가 없을 수 있음
                log.info("items.item 비어있음 (공휴일 0건). year={}", year);
                return List.of();
            }

            // 6. item 타입이 List면 그대로 캐스팅, 단일 Map이면 리스트로 감싸서 반환
            if (item instanceof List) {
                return (List<Map<String, Object>>) item;
            } else {
                return List.of((Map<String, Object>) item);
            }

        } catch (Exception e) {
            // 7. 네트워크 장애, 파싱 오류 등 모든 예외를 로깅하고 빈 리스트 반환 (상위 로직 보호)
            log.error("❌ 공휴일 API 호출 실패. year={}, msg={}", year, e.getMessage(), e);
            return List.of();
        }
    }
}
