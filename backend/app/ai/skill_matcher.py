def calculate_skill_match(user_skills, job_skills):

    # Convert both lists into sets
    user_set = set(user_skills)
    job_set = set(job_skills)

    # Skills present in both
    matched_skills = list(user_set.intersection(job_set))

    # Skills missing from user
    missing_skills = list(job_set - user_set)

    # Calculate percentage
    if len(job_set) == 0:
        match_percentage = 0
    else:
        match_percentage = round(
            (len(matched_skills) / len(job_set)) * 100,
            2
        )

    return {
        "match_percentage": match_percentage,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }

