package com.brycen.brycenadmin.domain.sample;

import com.brycen.brycenadmin.domain.sample.entity.PubConsumer;
import com.brycen.brycenadmin.domain.sample.repository.PubConsumerDataGenerateRepository;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PubConsumerDataGenerateService {

    private final static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final String[] domains = {"gmail.com", "naver.com", "outlook.com", "yahoo.com", "daum.net"};
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final PubConsumerDataGenerateRepository pubCustomerDataGenerateRepository;

    public void generateData() {
        JSONArray names = generateRandomNm();
        for (int i = 0; i < names.length(); i++) {
            JSONObject obj = names.getJSONObject(i);
            String ko = obj.getString("kor");
            String en = obj.getString("eng");

            String mbrId = "SK" + renderDate() + String.format("%04d", i + 1);

            String hashedPassword = encoder.encode(en + "2025!!");
            String phone = generatePhone();

            PubConsumer u = PubConsumer.builder()
                    .mbrId(mbrId)
                    .userEmail(en.toLowerCase() + "@" + domains[new Random().nextInt(domains.length)])
                    .password(hashedPassword)
                    .mskName(ko.substring(0, ko.length() - 1) + "*")
                    .aesName(ko)
                    .aesPhone(phone)
                    .mskPhone(phone.replaceAll("(?<=010-)(\\d{4})(?=-\\d{4})", "****"))
                    .ci(null)
                    .build();

            pubCustomerDataGenerateRepository.save(u);
        }

    }

    String generatePhone() {
        return "010-" + (int) (Math.random() * 9000 + 1000) + "-" + (int) (Math.random() * 9000 + 1000);
    }

    JSONArray generateRandomNm() throws JSONException {
        String prompt = """
                    Generate 100 realistic Korean full names (last name + first name), female only.
                    Provide both the original Korean name and its Romanized version.
                    Format output as a JSON array like:
                    [
                      {"kor": "이민지", "eng": "minji.lee"},
                      {"kor": "김지수", "eng": "jisoo.kim"}
                    ]
                    No explanation. No extra text.
                """;

        Client client = Client.builder().apiKey("AIza...").build();

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-2.5-flash",
                        prompt,
                        null);

        String result = response.text();

        if (result.startsWith("```")) {
            result = result.replaceAll("(?s)```(?:json)?\\s*", "").replaceAll("\\s*```\\s*$", "");
        }

        return new JSONArray(result);
    }

    String renderDate() {
        LocalDateTime now = LocalDateTime.now();
        return now.format(formatter);
    }
}
