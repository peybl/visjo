package at.tu.visjo.util;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Locale;
import java.util.Random;

@Service
public class RandomString {

	public static final String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	public static final String lower = upper.toLowerCase(Locale.ROOT);
	public static final String digits = "0123456789";

	private final String symbols = upper + lower + digits;
	private final Random random = new SecureRandom();

	public String generateAlphanumeric(int length) {
		char[] alphanumeric = new char[length];
		for (int i = 0; i < length; ++i) {
			int pos = random.nextInt(symbols.length());
			alphanumeric[i] = symbols.charAt(pos);
		}
		return new String(alphanumeric);
	}
}
