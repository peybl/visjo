package at.tu.visjo.util;

import at.tu.visjo.persistence.model.Model;
import lombok.NonNull;

import java.util.Iterator;
import java.util.List;

public abstract class Utils {

	public static <T extends Model> String modelsToString(@NonNull List<T> models) {
		StringBuilder builder = new StringBuilder();
		Iterator<T> iter = models.listIterator();

		while (iter.hasNext()) {
			builder.append(iter.next()
							   .getId());

			if (iter.hasNext()) {
				builder.append(", ");
			}
		}

		return builder.toString();
	}
}
